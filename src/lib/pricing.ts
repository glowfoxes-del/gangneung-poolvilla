import { differenceInDays, addDays, format, isFriday, isSaturday, isSunday } from "date-fns";
import { content } from "@/constants/content";

export interface PricingResult {
    nights: number;
    baseTotal: number;
    seasonSurcharge: number;
    weekendSurcharge: number;
    guestSurcharge: number;
    optionTotal: number;
    totalAmount: number;
    breakdown: {
        date: string;
        price: number;
        isWeekend: boolean;
        isSeason: boolean;
    }[];
}

export interface BookingOptions {
    checkIn: Date;
    checkOut: Date;
    guests: number;
    roomId: string;
    selectedOptions: string[]; // Option IDs
}

export function calculateBookingPrice(params: BookingOptions): PricingResult {
    const { checkIn, checkOut, guests, roomId, selectedOptions } = params;
    const room = content.rooms.find((r) => r.id === roomId);
    const rules = content.pricingRules;

    if (!room) {
        throw new Error("Invalid Room ID");
    }

    const nights = differenceInDays(checkOut, checkIn);
    if (nights < 1) {
        throw new Error("Check-out must be after check-in");
    }

    let baseTotal = 0;
    let seasonSurcharge = 0;
    let weekendSurcharge = 0;
    const breakdown = [];

    // 1. Daily Price Calculation
    for (let i = 0; i < nights; i++) {
        const currentDate = addDays(checkIn, i);
        const dateStr = format(currentDate, "yyyy-MM-dd");

        // Determine day type
        const isFri = isFriday(currentDate);
        const isSat = isSaturday(currentDate);
        // Simple weekend logic: Fri/Sat are expensive. Sunday treated as weekday here (or custom).
        // content.ts says: weekday, friday, weekend(Sat)

        let dailyPrice = room.prices.weekday;
        let isWeekend = false;

        if (isSat) {
            dailyPrice = room.prices.weekend;
            isWeekend = true;
        } else if (isFri) {
            dailyPrice = room.prices.friday;
            isWeekend = true; // Treated as special day
        }

        // TODO: Add Season Logic here (e.g. July/Aug)
        const isSeason = false; // Placeholder
        // if (isSeason) dailyPrice += 50000; 

        breakdown.push({
            date: dateStr,
            price: dailyPrice,
            isWeekend,
            isSeason,
        });

        baseTotal += dailyPrice;
    }

    // 2. Guest Surcharge
    const extraGuests = Math.max(0, guests - rules.baseGuestCount);
    const guestSurcharge = extraGuests * rules.extraGuestSurcharge * nights; // Per night charge? Usually per night.
    // content.ts doesn't specify if per night. Assuming per night is standard for pensions.

    // 3. Options Surcharge
    let optionTotal = 0;
    selectedOptions.forEach((optId) => {
        const option = rules.options.find((o) => o.id === optId);
        if (option) {
            if (option.type === "PER_NIGHT") {
                optionTotal += option.price * nights;
            } else {
                optionTotal += option.price; // PER_STAY
            }
        }
    });

    const totalAmount = baseTotal + guestSurcharge + optionTotal;

    return {
        nights,
        baseTotal,
        seasonSurcharge, // Included in baseTotal breakdown for now, can separate if needed
        weekendSurcharge, // Included in baseTotal breakdown
        guestSurcharge,
        optionTotal,
        totalAmount,
        breakdown,
    };
}
