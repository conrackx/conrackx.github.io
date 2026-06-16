import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-toc-done-right";
import htmlmin from "html-minifier-terser";
import Image from "@11ty/eleventy-img";
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addCollection("blog", collection => {
    return collection.getFilteredByGlob("src/content/blog/*.md").sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("projects", collection => {
    return collection.getFilteredByGlob("src/content/projects/*.md").sort((a, b) => b.date - a.date);
  });
  eleventyConfig.addCollection("speaking", collection => {
    return collection.getFilteredByGlob("src/content/speaking/*.md");
  });

  eleventyConfig.addFilter("readableDate", date => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });
  eleventyConfig.addFilter("currentYear", () => {
    return new Date().getFullYear().toString();
  });
  eleventyConfig.addFilter("readingTime", content => {
    const text = content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const words = text.split(" ").filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  });
  eleventyConfig.addFilter("excerpt", content => {
    const text = content.replace(/\n/g, "").replace(/<[^>]+>/g, "");
    return text.length > 160 ? text.slice(0, 157) + "..." : text;
  });
  eleventyConfig.addShortcode("icon", name => {
    return `<svg class="icon" role="img" aria-hidden="true"><use href="/assets/icons/sprite.svg#${name}"></use></svg>`;
  });

  eleventyConfig.addShortcode("image", async (src, alt, widthsOrOpts, sizes, cls) => {
    const projectRoot = path.join(__dirname, "src");
    let widths, sizesAttr;
    if (typeof widthsOrOpts === "object" && !Array.isArray(widthsOrOpts)) {
      ({ widths = [400, 800], sizes: sizesAttr = "(max-width: 768px) 200px, 400px" } = widthsOrOpts);
    } else {
      widths = Array.isArray(widthsOrOpts) ? widthsOrOpts : [400, 800];
      sizesAttr = sizes || "(max-width: 768px) 200px, 400px";
    }
    let metadata = await Image(path.join(projectRoot, src), {
      widths,
      formats: ["avif", "webp", "jpeg"],
      outputDir: path.join(__dirname, "_site", "assets", "images"),
      urlPath: "/assets/images/"
    });
    return Image.generateHTML(metadata, {
      alt,
      sizes: sizesAttr,
      loading: "lazy",
      decoding: "async",
      class: cls || ""
    });
  });

  eleventyConfig.addTransform("concatCss", async (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    const cssDir = path.join(__dirname, "_site", "assets", "css");
    const files = ["variables.css", "base.css", "components.css", "layout.css", "print.css"];
    const parts = [];
    for (const f of files) {
      const fp = path.join(cssDir, f);
      if (fs.existsSync(fp)) parts.push(fs.readFileSync(fp, "utf-8"));
    }
    const combined = parts.join("\n");
    fs.writeFileSync(path.join(cssDir, "all.css"), combined);
    return content;
  });

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.ignores.add("src/**/agents.md");
  eleventyConfig.ignores.add("src/content/blog/_archive/**");
  eleventyConfig.ignores.add("src/content/projects/_archive/**");

  const minifyCss = code => code.replace(/\s+/g, "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
  eleventyConfig.addFilter("minifyCss", minifyCss);
  eleventyConfig.addFilter("limit", (arr, limit) => limit ? (Array.isArray(arr) ? arr.slice(0, parseInt(limit)) : arr) : arr);
  eleventyConfig.addFilter("findBySlug", (arr, slug) => {
    if (!Array.isArray(arr)) return null;
    return arr.find(item => item.fileSlug === slug || item.data.page?.fileSlug === slug || item.template?.fileSlug === slug) || null;
  });

  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, { permalink: false })
    .use(markdownItToc, { containerClass: "toc", listType: "ul" });

  const defaultFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.info.trim() === "mermaid") {
      return `<div class="mermaid">\n${token.content}\n</div>`;
    }
    return defaultFence(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", md);

  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addTransform("htmlmin", async content => {
      let minified = await htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: false
      });
      return minified;
    });
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
