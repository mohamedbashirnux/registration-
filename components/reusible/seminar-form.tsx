"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/reusible/date-picker"
import { seminarSchema, type SeminarFormData } from "@/lib/validations/seminar"

interface SeminarFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  loading?: boolean
  initialData?: Partial<SeminarFormData>
}

export function SeminarForm({ onSubmit, onCancel, loading = false, initialData = {} }: SeminarFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SeminarFormData>({
    resolver: zodResolver(seminarSchema),
    defaultValues: initialData,
  })

  const type = watch("type")
  const courseStartDate = watch("courseStartDate")
  const courseEndDate = watch("courseEndDate")
  const certificateData = watch("certificateData")
  const lectureImage = watch("lectureImage")

  const onSubmitForm = async (data: SeminarFormData) => {
    // Convert image file to base64 if exists
    let imageBase64 = ""
    if (data.lectureImage) {
      const reader = new FileReader()
      imageBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(data.lectureImage!)
      })
    }
    
    // Prepare data with base64 image
    const submitData = {
      title: data.title,
      type: data.type,
      courseStartDate: data.courseStartDate,
      courseEndDate: data.courseEndDate,
      certificateData: data.certificateData,
      location: data.location,
      lectureImage: imageBase64,
      lectureName: data.lectureName,
      lectureBio: data.lectureBio,
      summary: data.summary
    }
    
    await onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select value={type} onValueChange={(value) => setValue("type", value as "course" | "seminar")}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="e.g., Multimedia, JavaScript"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseStartDate">Course Start Date *</Label>
          <DatePicker
            date={courseStartDate}
            onSelect={(date) => setValue("courseStartDate", date!)}
            placeholder="Select start date"
          />
          {errors.courseStartDate && <p className="text-sm text-destructive">{errors.courseStartDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseEndDate">Course End Date *</Label>
          <DatePicker
            date={courseEndDate}
            onSelect={(date) => setValue("courseEndDate", date!)}
            placeholder="Select end date"
          />
          {errors.courseEndDate && <p className="text-sm text-destructive">{errors.courseEndDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificateData">Certificate Date *</Label>
          <DatePicker
            date={certificateData}
            onSelect={(date) => setValue("certificateData", date!)}
            placeholder="Select certificate date"
          />
          {errors.certificateData && <p className="text-sm text-destructive">{errors.certificateData.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Enter location"
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lectureImage">Lecture Image *</Label>
          <Input
            id="lectureImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setValue("lectureImage", file)
            }}
          />
          {lectureImage && (
            <p className="text-xs text-muted-foreground">
              Selected: {lectureImage.name}
            </p>
          )}
          {errors.lectureImage && <p className="text-sm text-destructive">{errors.lectureImage.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lectureName">Lecturer Name *</Label>
          <Input
            id="lectureName"
            {...register("lectureName")}
            placeholder="Enter lecturer name"
          />
          {errors.lectureName && <p className="text-sm text-destructive">{errors.lectureName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lectureBio">Lecturer Bio</Label>
        <Textarea
          id="lectureBio"
          {...register("lectureBio")}
          placeholder="Enter lecturer bio (optional)"
          rows={3}
        />
        {errors.lectureBio && <p className="text-sm text-destructive">{errors.lectureBio.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary/Description</Label>
        <Textarea
          id="summary"
          {...register("summary")}
          placeholder="Enter seminar summary or description (optional)"
          rows={4}
        />
        {errors.summary && <p className="text-sm text-destructive">{errors.summary.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  )
}