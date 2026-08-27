// src/services/resumeDocxGenerator.ts
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  skills: string[];
}

export class ResumeDocxGenerator {
  public static async generate(data: ResumeData): Promise<Blob> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header: Name
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: data.contact.fullName,
                  bold: true,
                  size: 32, // 16pt font
                  font: "Calibri",
                }),
              ],
            }),

            // Contact Information Line
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${data.contact.email} | ${data.contact.phone} | ${data.contact.location}`,
                  size: 20, // 10pt font
                  font: "Calibri",
                }),
              ],
            }),

            // Professional Summary
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "Professional Summary",
                  bold: true,
                  size: 24,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: data.summary,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),

            // Experience Section
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "Experience",
                  bold: true,
                  size: 24,
                  font: "Calibri",
                }),
              ],
            }),
            ...data.experience.flatMap((exp) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.position} - ${exp.company}`,
                    bold: true,
                    size: 22,
                    font: "Calibri",
                  }),
                  new TextRun({
                    text: ` (${exp.startDate} – ${exp.endDate})`,
                    italics: true,
                    size: 20,
                    font: "Calibri",
                  }),
                ],
              }),
              ...exp.description.map(
                (bullet) =>
                  new Paragraph({
                    bullet: { level: 0 },
                    children: [
                      new TextRun({
                        text: bullet,
                        size: 20,
                        font: "Calibri",
                      }),
                    ],
                  })
              ),
            ]),

            // Skills Section
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({
                  text: "Skills",
                  bold: true,
                  size: 24,
                  font: "Calibri",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: data.skills.join(", "),
                  size: 20,
                  font: "Calibri",
                }),
              ],
            }),
          ],
        },
      ],
    });

    return await Packer.toBlob(doc);
  }
}