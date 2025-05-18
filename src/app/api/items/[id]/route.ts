import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';

// Validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET /api/items/[id]
 * Get a single item by ID
 */
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;

  // Validate ID format first to avoid unnecessary DB connection
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid item ID format' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    
    // Use lean() for faster query - returns plain JS object instead of Mongoose document
    const item = await Item.findById(id).lean();
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/items/[id]
 * Update an item
 */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;
  
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid item ID format' },
      { status: 400 }
    );
  }
  
  try {
    const body = await request.json();
    await dbConnect();
    
    // Use findByIdAndUpdate with { new: true } to return the updated document
    // Also use runValidators to ensure update follows schema validation
    const item = await Item.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    ).lean();
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string> = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json(
        { success: false, error: 'Validation failed', validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Delete an item
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = params;
  
  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid item ID format' },
      { status: 400 }
    );
  }
  
  try {
    await dbConnect();
    
    const item = await Item.findByIdAndDelete(id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}