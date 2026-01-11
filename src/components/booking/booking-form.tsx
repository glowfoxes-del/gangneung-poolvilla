"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Loader2, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { content } from "@/constants/content";
import { bookingSchema } from "@/schemas/booking";
import { calculatePriceAction, createPendingBooking } from "@/app/booking/actions";

// Extended schema for form (date range handling)
const formSchema = bookingSchema.extend({
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }),
}).omit({ checkIn: true, checkOut: true }); // We derive these from dateRange

type FormValues = z.infer<typeof formSchema>;

export function BookingForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRoomId = searchParams.get("roomId") || "";

    const [isCalculating, setIsCalculating] = React.useState(false);
    const [priceData, setPriceData] = React.useState<any>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            roomId: initialRoomId,
            guests: 2,
            guestName: "",
            guestContact: "",
            selectedOptions: [],
            // dateRange will be undefined initially
        },
    });

    const watchRoomId = form.watch("roomId");
    const watchDateRange = form.watch("dateRange");
    const watchGuests = form.watch("guests");
    const watchOptions = form.watch("selectedOptions");

    // selected room data
    const selectedRoom = content.rooms.find(r => r.id === watchRoomId);

    // Auto-calculate price when relevant fields change
    React.useEffect(() => {
        async function fetchPrice() {
            if (!watchRoomId || !watchDateRange?.from || !watchDateRange?.to) {
                setPriceData(null);
                return;
            }

            // Basic client-side validation for range
            if (watchDateRange.from >= watchDateRange.to) {
                setPriceData(null);
                return;
            }

            setIsCalculating(true);
            try {
                const res = await calculatePriceAction({
                    roomId: watchRoomId,
                    checkIn: watchDateRange.from,
                    checkOut: watchDateRange.to,
                    guests: watchGuests,
                    selectedOptions: watchOptions,
                });

                if (res.success) {
                    setPriceData((res as any).data);
                } else {
                    toast.error("가격 계산 실패: " + res.error);
                    setPriceData(null);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsCalculating(false);
            }
        }

        const timer = setTimeout(() => {
            fetchPrice();
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [watchRoomId, watchDateRange, watchGuests, watchOptions]);


    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        try {
            // transform form data to API expectation
            const payload = {
                ...data,
                checkIn: data.dateRange.from,
                checkOut: data.dateRange.to,
            };

            const res = await createPendingBooking(payload);

            if (res.success) {
                toast.success("예약이 접수되었습니다! 결제 페이지로 이동합니다.");
                // Navigate to payment page (Portone integration later, for now success page)
                // Or Payment Modal.
                // For Phase 5, goal is "Create PENDING booking -> Then Request Payment".
                // Let's redirect to a payment confirm page or summary.
                router.push(`/payment/checkout?bookingId=${res.bookingId}&code=${res.lookupCode}`);
            } else {
                toast.error(res.error || "예약 생성 실패");
            }
        } catch (e) {
            toast.error("알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>예약 정보 입력</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/* 1. Room Selection */}
                                <FormField
                                    control={form.control}
                                    name="roomId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>객실 선택</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="객실을 선택해주세요" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {content.rooms.map((room) => (
                                                        <SelectItem key={room.id} value={room.id}>
                                                            {room.name} (기준 {room.capacity.standard}인 / 최대 {room.capacity.max}인)
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* 2. Date Selection */}
                                <FormField
                                    control={form.control}
                                    name="dateRange"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>일정 선택 (체크인 Date ~ 체크아웃 Date)</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value?.from ? (
                                                                field.value.to ? (
                                                                    <>
                                                                        {format(field.value.from, "PPP", { locale: ko })} -{" "}
                                                                        {format(field.value.to, "PPP", { locale: ko })}
                                                                    </>
                                                                ) : (
                                                                    format(field.value.from, "PPP", { locale: ko })
                                                                )
                                                            ) : (
                                                                <span>날짜를 선택해주세요</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="range"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                체크인은 15:00, 체크아웃은 11:00 입니다.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* 3. Guests */}
                                <FormField
                                    control={form.control}
                                    name="guests"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>인원</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="인원 선택" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {selectedRoom ? (
                                                        Array.from({ length: selectedRoom.capacity.max }, (_, i) => i + 1).map(num => (
                                                            <SelectItem key={num} value={String(num)}>{num}명</SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="2">2명</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                {/* 4. Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="guestName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>예약자 성함</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="홍길동" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="guestContact"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>연락처</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="01012345678" {...field} />
                                                </FormControl>
                                                <FormDescription>'-' 없이 숫자만 입력해주세요.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* 5. Options */}
                                {content.pricingRules.options.length > 0 && (
                                    <FormField
                                        control={form.control}
                                        name="selectedOptions"
                                        render={() => (
                                            <FormItem>
                                                <div className="mb-4">
                                                    <FormLabel className="text-base">추가 옵션</FormLabel>
                                                    <FormDescription>
                                                        원하시는 추가 옵션을 선택해주세요.
                                                    </FormDescription>
                                                </div>
                                                {content.pricingRules.options.map((item) => (
                                                    <FormField
                                                        key={item.id}
                                                        control={form.control}
                                                        name="selectedOptions"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item.id}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...(field.value || []), item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal cursor-pointer">
                                                                        {item.name} (+{item.price.toLocaleString()}원 / {(item.type as string) === 'PER_NIGHT' ? '1박' : '1회'})
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* Submit Button */}
                                <Button type="submit" size="lg" className="w-full mt-8" disabled={isSubmitting || !priceData}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            예약 처리 중...
                                        </>
                                    ) : (
                                        "예약 및 결제하기"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader className="bg-zinc-50 border-b">
                        <CardTitle className="text-lg">결제 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        {priceData ? (
                            <>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">객실료 ({priceData.nights}박)</span>
                                        <span>{priceData.baseTotal.toLocaleString()}원</span>
                                    </div>
                                    {priceData.seasonSurcharge > 0 && (
                                        <div className="flex justify-between text-amber-600">
                                            <span>성수기 할증</span>
                                            <span>+{priceData.seasonSurcharge.toLocaleString()}원</span>
                                        </div>
                                    )}
                                    {priceData.weekendSurcharge > 0 && ( // Logic might fold this into baseTotal depends on pricing.ts
                                        <div className="flex justify-between text-indigo-600">
                                            <span>주말/공휴일 할증</span>
                                            <span>(포함)</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">인원 추가 ({Math.max(0, watchGuests - content.pricingRules.baseGuestCount)}명)</span>
                                        <span>+{priceData.guestSurcharge.toLocaleString()}원</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">옵션 합계</span>
                                        <span>+{priceData.optionTotal.toLocaleString()}원</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">총 결제금액</span>
                                    <span className="font-bold text-xl text-primary">{priceData.totalAmount.toLocaleString()}원</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                                <Info className="w-8 h-8 mb-2 opacity-50" />
                                <p>객실과 날짜를 선택하면<br />금액이 표시됩니다.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
