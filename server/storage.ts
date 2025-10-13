import { airports, quotes, users, type User, type InsertUser, type Airport, type InsertAirport, type Quote, type InsertQuote } from "@shared/schema";
import { db, pool } from "./db";
import { eq, ilike, or, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.SessionStore;
  
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Airport methods
  searchAirports(query: string): Promise<Airport[]>;
  getAirportByIata(code: string): Promise<Airport | undefined>;
  createAirport(airport: InsertAirport): Promise<Airport>;
  getAllAirports(): Promise<Airport[]>;
  
  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuote(id: string): Promise<Quote | undefined>;
  getQuoteByNumber(quoteNumber: string): Promise<Quote | undefined>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: string): Promise<Quote | undefined>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Airport methods
  async searchAirports(query: string): Promise<Airport[]> {
    const searchQuery = `%${query.toLowerCase()}%`;
    
    return await db
      .select()
      .from(airports)
      .where(
        or(
          ilike(airports.city, searchQuery),
          ilike(airports.name, searchQuery),
          ilike(airports.iataCode, searchQuery),
          ilike(airports.country, searchQuery)
        )
      )
      .limit(20)
      .orderBy(airports.city);
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
}

export const storage = new DatabaseStorage();
