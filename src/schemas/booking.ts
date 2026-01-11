import { z } from "zod";

export const bookingSchema = z.object({
    roomId: z.string(),
    checkIn: z.date(),
    checkOut: z.date(),
    guests: z.number().min(1),
    guestName: z.string().min(2, "이름을 입력해주세요."),
    guestContact: z.string().regex(/^010\d{8}$/, "올바른 휴대폰 번호를 입력해주세요 (- 제외)."),
    selectedOptions: z.array(z.string()).optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
