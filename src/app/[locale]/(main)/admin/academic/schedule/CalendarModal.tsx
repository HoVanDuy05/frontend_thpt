"use client";

import { Modal, Select, NumberInput, TextInput, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { AppQuery } from "@/api/AppQuery";

interface CalendarModalProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    loading?: boolean;
    lopNamId?: number; // Pass lopNamId from parent
}

export function CalendarModal({ opened, onClose, onSubmit, initialData, loading, lopNamId }: CalendarModalProps) {
    const { data: subjects } = AppQuery.academic.useSubjects();
    const { data: teachers } = AppQuery.user.useList({ role: "GIAO_VIEN" } as any);

    useEffect(() => {
        if (teachers) {
            console.log('CalendarModal Teachers Raw Data:', teachers);
            const mapped = teachers
                ?.filter((t: any) => t.hoSoGiaoVien?.id)
                ?.map((t: any) => ({
                    value: String(t.hoSoGiaoVien.id),
                    label: t.hoSoGiaoVien.hoTen || t.taiKhoan,
                    userId: t.id,
                    profileId: t.hoSoGiaoVien?.id
                }));
            console.log('CalendarModal Mapped Teachers:', mapped);
        }
    }, [teachers]);

    const form = useForm({
        initialValues: {
            monHocId: "",
            gvDayId: "",
            thu: 2,
            tietBatDau: 1,
            soTiet: 1,
            phongHoc: "",
        },
        validate: {
            monHocId: (value) => (!value ? "Vui lòng chọn môn học" : null),
            thu: (value) => (value < 2 || value > 8 ? "Thứ phải từ 2-8" : null),
            tietBatDau: (value) => (value < 1 || value > 10 ? "Tiết phải từ 1-10" : null),
            soTiet: (value) => (value < 1 || value > 5 ? "Số tiết phải từ 1-5" : null),
        },
    });

    useEffect(() => {
        if (opened) {
            if (initialData) {
                form.setValues({
                    monHocId: initialData.monHocId ? String(initialData.monHocId) : "",
                    gvDayId: initialData.gvDayId ? String(initialData.gvDayId) : "",
                    thu: initialData.thu || 2,
                    tietBatDau: initialData.tietBatDau || 1,
                    soTiet: initialData.soTiet || 1,
                    phongHoc: initialData.phongHoc || "",
                });
            } else {
                form.reset();
            }
        }
    }, [initialData, opened]);

    const handleSubmit = (values: any) => {
        const payload: any = {
            lopNamId: lopNamId || initialData?.lopNamId,
            monHocId: Number(values.monHocId),
            thu: Number(values.thu),
            tietBatDau: Number(values.tietBatDau),
            soTiet: Number(values.soTiet),
            phongHoc: values.phongHoc?.trim() || null,
        };

        if (values.gvDayId && values.gvDayId !== "") {
            payload.gvDayId = Number(values.gvDayId);
        } else {
            payload.gvDayId = null;
        }

        onSubmit(payload);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={initialData?.id ? "Chỉnh sửa lịch học" : "Thêm lịch học mới"}
            radius="md"
            size="lg"
            fullScreen={(typeof window !== 'undefined' && window.innerWidth < 768)}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <Select
                        label="Môn học"
                        placeholder="Chọn môn học"
                        data={subjects?.map((s: any) => ({ value: String(s.id), label: s.tenMon })) || []}
                        required
                        searchable
                        {...form.getInputProps("monHocId")}
                    />
                    <Select
                        label="Giáo viên"
                        placeholder="Chọn giáo viên (tùy chọn)"
                        data={teachers
                            ?.filter((t: any) => t.hoSoGiaoVien?.id)
                            ?.map((t: any) => ({
                                value: String(t.hoSoGiaoVien.id),
                                label: t.hoSoGiaoVien.hoTen || t.taiKhoan
                            })) || []}
                        searchable
                        clearable
                        {...form.getInputProps("gvDayId")}
                    />
                    <Group grow>
                        <Select
                            label="Thứ"
                            data={[
                                { value: "2", label: "Thứ 2" },
                                { value: "3", label: "Thứ 3" },
                                { value: "4", label: "Thứ 4" },
                                { value: "5", label: "Thứ 5" },
                                { value: "6", label: "Thứ 6" },
                                { value: "7", label: "Thứ 7" },
                                { value: "8", label: "Chủ nhật" },
                            ]}
                            {...form.getInputProps("thu")}
                            value={String(form.values.thu)}
                            onChange={(val) => form.setFieldValue("thu", Number(val))}
                        />
                        <NumberInput
                            label="Tiết bắt đầu"
                            min={1}
                            max={10}
                            {...form.getInputProps("tietBatDau")}
                        />
                    </Group>
                    <Group grow>
                        <NumberInput
                            label="Số tiết"
                            min={1}
                            max={5}
                            {...form.getInputProps("soTiet")}
                        />
                        <TextInput
                            label="Phòng học"
                            placeholder="VD: A101"
                            {...form.getInputProps("phongHoc")}
                        />
                    </Group>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="subtle" onClick={onClose} color="gray">Hủy</Button>
                        <Button type="submit" loading={loading} color="indigo">
                            {initialData?.id ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
