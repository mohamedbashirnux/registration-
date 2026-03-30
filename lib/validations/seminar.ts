import { z } from "zod"

export const seminarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["course", "seminar"]),
  courseStartDate: z.date(),
  courseEndDate: z.date(),
  certificateData: z.date(),
  location: z.string().min(1, "Location is required"),
  lectureImage: z.instanceof(File).nullable().optional().refine(
    (file) => !file || file.size <= 5000000,
    "Image must be less than 5MB"
  ),
  lectureName: z.string().min(1, "Lecturer name is required"),
  lectureBio: z.string().optional(),
  summary: z.string().optional(),
})

export type SeminarFormData = z.infer<typeof seminarSchema>
