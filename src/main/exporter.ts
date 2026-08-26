import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ResumeBlock } from '../shared/types';

export class MultiFormatExporter {
  // Compile to native DOCX
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
            text: `\n${block.content}`,
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

  // Compile to Plain Text (.txt)
  public static exportToTxt(blocks: ResumeBlock[]): string {
    return blocks
      .map((b) => `${b.title.toUpperCase()}\n-------------------\n${b.content}\n`)
      .join('\n');
  }
}