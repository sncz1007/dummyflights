import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const airports = pgTable("airports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  iataCode: varchar("iata_code", { length: 3 }).notNull().unique(),
  icaoCode: varchar("icao_code", { length: 4 }),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  timezone: text("timezone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quoteNumber: varchar("quote_number", { length: 20 }).notNull().unique(),
  
  // Contact Information
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  country: text("country"),
  
  // Flight Details
  fromAirport: text("from_airport").notNull(),
  toAirport: text("to_airport").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date"),
  passengers: integer("passengers").notNull(),
  flightClass: varchar("flight_class", { length: 20 }).notNull(),
  tripType: varchar("trip_type", { length: 20 }).notNull().default("roundtrip"),
  
  // Additional Information
  notes: text("notes"),
  language: varchar("language", { length: 5 }).notNull().default("en"),
  
  // Status
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  processed: boolean("processed").notNull().default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const airportsRelations = relations(airports, ({ many }) => ({
  // Add relations if needed in the future
}));

// Bookings table for flight reservations and payments
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingNumber: varchar("booking_number", { length: 20 }).notNull().unique(),
  
  // Customer Information
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth").notNull(),
  
  // Additional Passengers (stored as JSON array)
  additionalPassengers: text("additional_passengers"), // JSON string with [{fullName: string, dateOfBirth: string}]
  
  // Flight Search Parameters
  fromAirport: text("from_airport").notNull(),
  toAirport: text("to_airport").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date"),
  passengers: integer("passengers").notNull(),
  flightClass: varchar("flight_class", { length: 20 }).notNull(),
  tripType: varchar("trip_type", { length: 20 }).notNull(),
  
  // Selected Flight Details (stored as JSON)
  selectedFlightData: text("selected_flight_data").notNull(), // JSON string with flight details
  
  // Pricing
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal("discounted_price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  
  // Payment Info
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"), // pending, completed, failed
  
  // Status
  bookingStatus: varchar("booking_status", { length: 20 }).notNull().default("pending"), // pending, confirmed, ticketed, cancelled
  ticketSent: boolean("ticket_sent").notNull().default(false),
  
  // Metadata
  language: varchar("language", { length: 5 }).notNull().default("en"),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotesRelations = relations(quotes, ({ one }) => ({
  // Add relations if needed in the future
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  // Add relations if needed in the future
}));

// Insert schemas
export const insertAirportSchema = createInsertSchema(airports).omit({
  id: true,
  createdAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  quoteNumber: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  departureDate: z.string(),
  returnDate: z.string().optional(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingNumber: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  departureDate: z.string(),
  returnDate: z.string().optional(),
  dateOfBirth: z.string(),
  additionalPassengers: z.string().optional(),
});

// Types
export type InsertAirport = z.infer<typeof insertAirportSchema>;
export type Airport = typeof airports.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
