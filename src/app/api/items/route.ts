import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Item from '@/models/Item';

/**
 * GET /api/items
 * Retrieve all items with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    // Build query object
    const query: any = {};
    
    if (category) query.category = category;
    if (inStock !== null) query.inStock = inStock === 'true';
    
    // Connect to database
    await dbConnect();
    
    // Execute optimized query with pagination
    const items = await Item.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    
    // Count total items for pagination (using cached count when possible)
    const count = await Item.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/items
 * Create a new item
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Connect to database
    await dbConnect();
    
    // Create new item
    const item = await Item.create(body);
    
    return NextResponse.json(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle validation errors separately
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