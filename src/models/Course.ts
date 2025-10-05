import mongoose, { Document, Schema } from "mongoose";

export interface IModule {
  title: string;
  topics: string[];
  classVideos: string[];
  files: string[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  modules: IModule[];
  instructor?: mongoose.Types.ObjectId;
  students?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
      maxlength: [100, "Module title cannot be more than 100 characters"],
    },
    topics: [
      {
        type: String,
        trim: true,
        maxlength: [200, "Topic cannot be more than 200 characters"],
      },
    ],
    classVideos: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (v: string) {
            // Basic URL validation for video URLs
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: "Please provide a valid video URL",
        },
      },
    ],
    files: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: true,
  }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Course title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [
        1000,
        "Course description cannot be more than 1000 characters",
      ],
    },
    modules: {
      type: [ModuleSchema],
      default: [],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
CourseSchema.index({ title: 1 });
CourseSchema.index({ instructor: 1 });

// Prevent model overwrite errors in Next.js
const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
