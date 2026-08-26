import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ResumeBlock } from './types';

export class MultiFormatExporter {
  public static async exportToDocx(blocks: ResumeBlock[]): Promise<Blob> {
    const docParagraphs = blocks.map((block) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: block.title,
            bold: true,
            size: 24,
          }),
          new TextRun({
            text: `\n${block.content}\n`,
            size: 20,
          }),
        ],
      });
    });

    const doc = new Document({
      sections: [{ children: docParagraphs }],
    });

    return await Packer.toBlob(doc);
  }

  public static exportToTxt(blocks: ResumeBlock[]): string {
    return blocks
      .map((b) => `${b.title.toUpperCase()}\n-------------------\n${b.content}\n`)
      .join('\n');
  }
}
