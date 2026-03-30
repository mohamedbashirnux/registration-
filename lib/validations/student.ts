import { z } from "zod"

export const studentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
})

export type StudentFormData = z.infer<typeof studentSchema>
