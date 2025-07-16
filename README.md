
# [Babilim](https://babilim.info)

> An Open Source Digital Archive of Ancient Mythology and Deities


This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

![](src/assets/Babylon.jpg)

## Contributing

All contributions are welcomed and appreaciated. If you lack on technical knowledge and find something that should be changed about the content, you can use the comments box below each article.

Also, feel free to report any issue on this repository.

The following are instructions on how to contribute by generating and including more content, plus some introductory steps on coding at the bottom of the README for those who are brave enough.

## Getting Started

### Content Generation

All the content in this project is stored in an [Obsidian Vault](https://obsidian.md/) so everyone can play with it and update the content without much help. Just install the software and open the folder `src/content/vault` when you are asked for a folder.

### AI-Powered Content Generation

If you plan to generate large amount of articles, I suggest you to give a try to the included MCPs and Prompts.

To do this, you're gonna need an AI assistant with access to LLM models and MCPs. My personal choice is [Trae IDE](https://www.trae.ai/) because it's easy to customise agents and give them access to MCPs, but if you feel comfortable with other alternatives, that's totally fine. For the LLM, I pay per token on openrouter. Recommended model is [`anthropic/claude-sonnet-4`](https://openrouter.ai/anthropic/claude-sonnet-4) but any Claude family model should work fine (most of the content was generated with Sonnet 3.5).

#### Gods/Names Articles

##### 1. Open your AI Assistant MCP Settings and include the servers

```json
{
  "names-server": {
    "command": "npx",
    "args": [
      "-y",
      "env-cmd",
      "-f",
      "<replace-this-with-path-to-your-repo>/.env",
      "tsx",
      "<replace-this-with-path-to-your-repo>/.ai/mcp/singletons/addName.ts"
    ]
  },
}
```

##### 2. *[Optional]* Agent System Prompt

If your AI Assistant support Agents system prompts, create a new Agent, give it access to the "names-server" and "Web Search" MCPs and include the system prompt defined in `.ai/agents/gods-generator.md`

##### 3. Prompt

Asking for a new entry should be as easy as something like 

```tpl
Give me the egyptian name Ra

https://en.wikipedia.org/wiki/Ra
```

If you provide some website urls, the output it's gonna be more precise and appropiate.

#### Motifs Articles

##### 1. Open your AI Assistant MCP Settings and include the servers

```json
{
  "motifs-server": {
    "command": "npx",
    "args": [
      "-y",
      "env-cmd",
      "-f",
      "<replace-this-with-path-to-your-repo>/.env",
      "tsx",
      "<replace-this-with-path-to-your-repo>/.ai/mcp/singletons/addMotif.ts"
    ]
  }
}
```

##### 2. *[Optional]* Agent System Prompt

If your AI Assistant support Agents system prompts, create a new Agent, give it access to the "motifs-server" and "Web Search" MCPs and include the system prompt defined in `.ai/agents/motifs-generator.md`

##### 3. Prompt

Asking for a new entry should be as easy as following this example

```tpl
give me the motif A515.1.1.

http://www.dinor.demon.nl/motif/index.html?A515.1.1
https://en.wikipedia.org/wiki/Divine_twins
https://en.wikipedia.org/wiki/List_of_deities_by_classification
https://en.wikipedia.org/wiki/Motif-Index_of_Folk-Literature
```

In this case make sure to include the urls so it doesn't mess up with Motif identifiers.

URLs:
1. Specific Motif definition from some online index
2. Specific Motif examples (if available)
3. List of Deities Classification Wikipedia Page
4. Motif Index Wikipedia Page


#### Culture Articles

There's no MCP for culture atm

##### 1. Agent System Prompt

If your AI Assistant support Agents system prompts, create a new Agent, give it access to the "File System" and "Web Search" MCPs and include the system prompt defined in `.ai/agents/cultures-generator.md`

##### 3. Prompt

Asking for a new entry should be as easy as something like 

```tpl
Give me the culture Egyptian

https://en.wikipedia.org/wiki/Egyptian_mythology
```

#### Generating Thumbnails from MCPs

The best (and cheapest) way is to use a ChatGPT Plus account and generate the images by manually prompting it, but if you prefer to spend tokens on it and make the process more automatic:

##### 1. Enable the feature in `src/server/constants`

```ts
export const FEATURES = {
  GENERATE_THUMBNAIL: true,
} as const
```

##### 2. Setup your OpenAI API key in `.env`

```.env
OPENAI_API_KEY='my-key'
```

##### 3. Restart your MCPs

### Development

This project is built on top of [Astro.js](https://astro.build/) and [Tailwind](https://tailwindcss.com/). The content layer uses my custom loader for Obsidian [`astro-loader-obsidian`](https://github.com/aitorllj93/astro-loader-obsidian). Website is deployed to [Cloudflare](https://www.cloudflare.com/)

#### Running Dev Server

```sh
npm run dev
```

#### Building Pages

```sh
npm run build
```

#### Previewing Build

```sh
npm run release:preview
```

#### Deploying Build

```sh
npm run release:deploy
```
