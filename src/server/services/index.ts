import { homedir } from "node:os";
import { join } from "node:path";


import { KBRepository } from "./KBRepository";
import { ThumbnailRepository } from "./ThumbnailRepository";

const kbRepository = new KBRepository(join(homedir(), "Projects", "babilim-info", "src", "content", "vault"));
const thumbnailRepository = new ThumbnailRepository(join(homedir(), "Projects", "babilim-info", "src", "content", "vault"));

export {
  kbRepository,
  thumbnailRepository
};

