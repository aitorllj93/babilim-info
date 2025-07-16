import { join } from "node:path";

const VAULT_DIR = join(import.meta.dirname, '..', '..', 'content', 'vault');

import { KBRepository } from "./KBRepository";
import { ThumbnailRepository } from "./ThumbnailRepository";

const kbRepository = new KBRepository(VAULT_DIR);
const thumbnailRepository = new ThumbnailRepository(VAULT_DIR);

export {
  VAULT_DIR,
  kbRepository,
  thumbnailRepository
};

