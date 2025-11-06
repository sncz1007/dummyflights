import { airports, quotes, bookings, type Airport, type InsertAirport, type Quote, type InsertQuote, type Booking, type InsertBooking } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Airport methods
  searchAirports(query: string, country?: string): Promise<Airport[]>;
  getAirportByIata(code: string): Promise<Airport | undefined>;
  createAirport(airport: InsertAirport): Promise<Airport>;
  getAllAirports(): Promise<Airport[]>;
  
  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  getQuoteByNumber(quoteNumber: string): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: string): Promise<Quote | undefined>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingByNumber(bookingNumber: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  updateBookingPaymentIntent(id: string, paymentIntentId: string): Promise<Booking | undefined>;
  updateBookingPaymentStatus(id: string, status: string, paymentMethod?: string, totalPaid?: number): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;
  updateBookingWithPNR(id: string, pnrCode: string, amadeusOrderId: string): Promise<Booking | undefined>;
  updateBookingPdfDownload(id: string, pdfType: 'booking' | 'receipt'): Promise<Booking | undefined>;
  getBookingsWithFilters(filterType: string, date?: string): Promise<Booking[]>;
}

export class DatabaseStorage implements IStorage {
  // Airport methods
  async searchAirports(query: string, country?: string): Promise<Airport[]> {
    const { MAIN_AIRPORTS } = await import('./mainAirports.js');
    const searchQuery = `%${query.toLowerCase()}%`;
    
    const searchConditions = or(
      ilike(airports.city, searchQuery),
      ilike(airports.name, searchQuery),
      ilike(airports.iataCode, searchQuery),
      ilike(airports.country, searchQuery)
    );
    
    const whereClause = country 
      ? and(searchConditions, eq(airports.country, country))
      : searchConditions;
    
    const results = await db
      .select()
      .from(airports)
      .where(whereClause)
      .limit(50)
      .orderBy(airports.city);
    
    // Filtrar solo aeropuertos principales (1 por ciudad internacional)
    return results.filter(airport => MAIN_AIRPORTS.includes(airport.iataCode));
  }
  
  async getAirportByIata(code: string): Promise<Airport | undefined> {
    const [airport] = await db
      .select()
      .from(airports)
      .where(eq(airports.iataCode, code.toUpperCase()));
    return airport || undefined;
  }
  
  async createAirport(airport: InsertAirport): Promise<Airport> {
    const [newAirport] = await db
      .insert(airports)
      .values(airport)
      .returning();
    return newAirport;
  }
  
  async getAllAirports(): Promise<Airport[]> {
    return await db.select().from(airports).orderBy(airports.city);
  }
  
  // Quote methods
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const quoteNumber = `SKY${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Convert string dates to Date objects
    const departureDate = new Date(insertQuote.departureDate);
    const returnDate = insertQuote.returnDate ? new Date(insertQuote.returnDate) : null;
    
    const [quote] = await db
      .insert(quotes)
      .values({
        ...insertQuote,
        quoteNumber,
        departureDate,
        returnDate,
        updatedAt: new Date(),
      })
      .returning();
    return quote;
  }
  
  async getQuote(id: string): Promise<Quote | undefined> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || undefined;
  }
  
  async getQuoteByNumber(quoteNumber: string): Promise<Quote | undefined> {
    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.quoteNumber, quoteNumber));
    return quote || undefined;
  }
  
  async getAllQuotes(): Promise<Quote[]> {
    return await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt));
  }
  
  async updateQuoteStatus(id: string, status: string): Promise<Quote | undefined> {
    const [updatedQuote] = await db
      .update(quotes)
      .set({ status, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return updatedQuote || undefined;
  }
  
  // Booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingNumber = `BKG${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Convert string dates to Date objects
    const departureDate = new Date(insertBooking.departureDate);
    const returnDate = insertBooking.returnDate ? new Date(insertBooking.returnDate) : null;
    
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        bookingNumber,
        departureDate,
        returnDate,
        updatedAt: new Date(),
      })
      .returning();
    return booking;
  }
  
  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }
  
  async getBookingByNumber(bookingNumber: string): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.bookingNumber, bookingNumber));
    return booking || undefined;
  }
  
  async getAllBookings(): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));
  }
  
  async updateBookingPaymentIntent(id: string, paymentIntentId: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        stripePaymentIntentId: paymentIntentId,
        updatedAt: new Date() 
      })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }
  
  async updateBookingPaymentStatus(id: string, status: string, paymentMethod?: string, totalPaid?: number): Promise<Booking | undefined> {
    const updateData: any = { 
      paymentStatus: status,
      updatedAt: new Date() 
    };
    
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }
    
    if (totalPaid !== undefined) {
      updateData.totalPaid = totalPaid.toString();
    }
    
    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }
  
  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        bookingStatus: status,
        updatedAt: new Date() 
      })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }
  
  async updateBookingWithPNR(id: string, pnrCode: string, amadeusOrderId: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ 
        pnrCode: pnrCode,
        amadeusOrderId: amadeusOrderId,
        bookingStatus: 'confirmed',
        updatedAt: new Date() 
      })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }
  
  async updateBookingPdfDownload(id: string, pdfType: 'booking' | 'receipt'): Promise<Booking | undefined> {
    const now = new Date();
    const updateData = pdfType === 'booking' 
      ? { bookingPdfDownloaded: true, bookingPdfDownloadedAt: now, updatedAt: now }
      : { receiptPdfDownloaded: true, receiptPdfDownloadedAt: now, updatedAt: now };
    
    const [updatedBooking] = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }
  
  async getBookingsWithFilters(filterType: string, date?: string): Promise<Booking[]> {
    const { sql: sqlOp } = await import('drizzle-orm');
    
    if (filterType === 'all' || !filterType) {
      return await this.getAllBookings();
    }
    
    if (!date) {
      return await this.getAllBookings();
    }
    
    let startDate: Date;
    let endDate: Date;
    
    if (filterType === 'month') {
      // date format: "2025-11" (YYYY-MM)
      const [year, month] = date.split('-').map(Number);
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (filterType === 'day') {
      // date format: "2025-11-06" (YYYY-MM-DD)
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      return await this.getAllBookings();
    }
    
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          sqlOp`${bookings.createdAt} >= ${startDate}`,
          sqlOp`${bookings.createdAt} <= ${endDate}`
        )
      )
      .orderBy(desc(bookings.createdAt));
  }
}

export const storage = new DatabaseStorage();
