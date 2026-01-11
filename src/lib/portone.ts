import axios from "axios";

const PORTONE_API_URL = "https://api.portone.io";

export class PortoneV2Client {
    private apiSecret: string;
    private storeId: string;

    constructor() {
        this.apiSecret = process.env.PORTONE_V2_API_SECRET || "";
        this.storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "";
    }

    // V2 does not usually require a separate 'getToken' for server-side if using the API Secret directly in headers.
    // Standard V2 Authentication: Header "Authorization: PortOne <SECRET>"

    async getPayment(paymentId: string) {
        try {
            const res = await axios.get(`${PORTONE_API_URL}/payments/${paymentId}`, {
                headers: {
                    "Authorization": `PortOne ${this.apiSecret}`,
                    "Content-Type": "application/json",
                },
            });
            return res.data;
        } catch (error: any) {
            console.error("Portone V2 Error:", error.response?.data || error.message);
            // If 404, it might mean payment doesn't exist.
            if (error.response?.status === 404) return null;
            throw new Error("포트원 결제 조회 실패");
        }
    }
}

export const portone = new PortoneV2Client();
