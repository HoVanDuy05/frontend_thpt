import { z } from "zod";
import { ELoaiBaiViet } from "@/shared/types/portal.type";

export const postSchema = z.object({
    tieuDe: z.string().min(1, "Tiêu đề không được để trống"),
    duongDan: z.string().optional(),
    noiDung: z.string().min(10, "Nội dung quá ngắn"),
    tomTat: z.string().nullable().optional(),
    anhBia: z.string().nullable().optional(),
    loai: z.nativeEnum(ELoaiBaiViet),
    daXuatBan: z.boolean().default(false),
});

export type TPostSchema = z.infer<typeof postSchema>;
