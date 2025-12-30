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
}

export function CalendarModal({ opened, onClose, onSubmit, initialData, loading }: CalendarModalProps) {
    const { data: classes } = AppQuery.academic.useClasses();
    const { data: subjects } = AppQuery.academic.useSubjects();
    const { data: teachers } = AppQuery.user.useList({ vaiTro: "GIAO_VIEN" } as any);

    const form = useForm({
        initialValues: {
            lopId: "",
            monHocId: "",
            gvDayId: "",
            thu: 2,
            tietBatDau: 1,
            soTiet: 2,
            phongHoc: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.setValues({
                lopId: String(initialData.lopId),
                monHocId: String(initialData.monHocId),
                gvDayId: initialData.gvDayId ? String(initialData.gvDayId) : "",
                thu: initialData.thu,
                tietBatDau: initialData.tietBatDau,
                soTiet: initialData.soTiet,
                phongHoc: initialData.phongHoc || "",
            });
        } else {
            form.reset();
        }
    }, [initialData, opened]);

    const handleSubmit = (values: any) => {
        onSubmit({
            ...values,
            lopId: Number(values.lopId),
            monHocId: Number(values.monHocId),
            gvDayId: values.gvDayId ? Number(values.gvDayId) : null,
        });
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={initialData ? "Chỉnh sửa lịch học" : "Thêm lịch học mới"}
            radius="md"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <Select
                        label="Lớp học"
                        placeholder="Chọn lớp"
                        data={classes?.map((c: any) => ({ value: String(c.id), label: c.tenLop })) || []}
                        required
                        {...form.getInputProps("lopId")}
                    />
                    <Select
                        label="Môn học"
                        placeholder="Chọn môn"
                        data={subjects?.map((s: any) => ({ value: String(s.id), label: s.tenMon })) || []}
                        required
                        {...form.getInputProps("monHocId")}
                    />
                    <Select
                        label="Giáo viên"
                        placeholder="Chọn giáo viên"
                        data={teachers?.map((t: any) => ({ value: String(t.id), label: t.hoSoGiaoVien?.hoTen || t.taiKhoan })) || []}
                        {...form.getInputProps("gvDayId")}
                    />
                    <Group grow>
                        <NumberInput
                            label="Thứ"
                            min={2}
                            max={8}
                            description="2-7, 8 là Chủ nhật"
                            {...form.getInputProps("thu")}
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
                            placeholder="A101"
                            {...form.getInputProps("phongHoc")}
                        />
                    </Group>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="subtle" onClick={onClose} color="gray">Hủy</Button>
                        <Button type="submit" loading={loading} color="blue">
                            {initialData ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
