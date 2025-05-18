import mongoose, { Schema } from 'mongoose';

// Define the Item interface
export interface IItem {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Item schema
const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this item'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this item'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price for this item'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category for this item'],
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Index for faster queries
ItemSchema.index({ name: 'text', category: 1 });

// Export the model
export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);