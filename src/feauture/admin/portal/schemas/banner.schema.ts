import { z } from "zod";

export const bannerSchema = z.object({
    tieuDe: z.string().min(1, "Tiêu đề không được để trống").nullable().optional(),
    moTa: z.string().nullable().optional(),
    hinhAnh: z.string().min(1, "Hình ảnh không được để trống"),
    lienKet: z.string().url("Liên kết không hợp lệ").nullable().optional().or(z.literal("")),
    thuTu: z.number().default(0),
    kichHoat: z.boolean().default(true),
});

export type TBannerSchema = z.infer<typeof bannerSchema>;
