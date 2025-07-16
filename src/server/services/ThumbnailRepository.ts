import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import compressImage from "../utils/compress-image";
import generateImage from "../utils/generate-image";

import god_thumbnail, {
  type TemplateVariables as GodThumbnailTemplateVariables,
} from "../utils/prompts/god_thumbnail";
import motif_thumbnail, {
  type TemplateVariables as MotifThumbnailTemplateVariables,
} from "../utils/prompts/motif_thumbnail";

type GodThumbnailInstructions = {
  type: "god";
  templateVariables: GodThumbnailTemplateVariables;
};

type MotifThumbnailInstructions = {
  type: "motif";
  templateVariables: MotifThumbnailTemplateVariables;
};

export type ThumbnailInstructions =
  | GodThumbnailInstructions
  | MotifThumbnailInstructions;

const thumbnailPrompts: Record<
  ThumbnailInstructions["type"],
  (templateVariables: ThumbnailInstructions["templateVariables"]) => string
> = {
  god: god_thumbnail,
  motif: motif_thumbnail,
};

export class ThumbnailRepository {
  constructor(private readonly cwd: string) {}

  public async generateThumbnail(
    entry: string,
    thumbnail: ThumbnailInstructions
  ) {
    const template = thumbnailPrompts[thumbnail.type];
    const prompt = template(thumbnail.templateVariables);

    const image = await generateImage(prompt);

    return this.postGenerate(entry, image);
  }

  private async postGenerate(entry: string, image: string) {
    const target = join(this.cwd, "Assets", `${entry}.png`);

    const image_bytes = Buffer.from(image, "base64");
    await writeFile(target, image_bytes);

    const jpgTarget = target.replace(".png", ".jpg");

    await compressImage(target, jpgTarget);

    return jpgTarget;
  }
}
