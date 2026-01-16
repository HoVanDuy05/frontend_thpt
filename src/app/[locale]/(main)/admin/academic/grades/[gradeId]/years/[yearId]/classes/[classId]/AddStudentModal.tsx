"use client";

import { useAddStudentsToClass, useGetAvailableStudents } from "@/api/AppQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Modal, Button, MultiSelect, Stack, Group, Text, Loader, Avatar } from "@mantine/core";
import { notifications } from "@mantine/notifications";

interface AddStudentModalProps {
    opened: boolean;
    onClose: () => void;
    yearId: number;
    classId: number;
}

export const AddStudentModal = ({ opened, onClose, yearId, classId }: AddStudentModalProps) => {
    const t = useTranslations('admin.academic');
    const common = useTranslations('common');

    // Fetch available students
    const { data: students, isLoading } = useGetAvailableStudents(yearId, { enabled: opened });

    // Mutation
    const addMutation = useAddStudentsToClass();

    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    const handleSubmit = async () => {
        if (selectedStudents.length === 0) return;

        addMutation.mutate(
            { classId, studentIds: selectedStudents.map(Number) },
            {
                onSuccess: () => {
                    setSelectedStudents([]);
                    onClose();
                }
            }
        );
    };

    // Prepare data for MultiSelect
    const selectData = (Array.isArray(students) ? students : [])?.map(u => ({
        value: u.id.toString(),
        label: `${u.hoTen} (${u.maSo || 'No ID'})`,
        image: u.avatar
    })) || [];

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('add_student')}
            size="lg"
            centered
        >
            <Stack>
                <Text size="sm" c="dimmed">
                    {t('add_student_description', { defaultMessage: 'Select students to add to this class. Only students not enrolled in any class for this year are shown.' })}
                </Text>

                {isLoading ? (
                    <Group justify="center" py="xl">
                        <Loader size="sm" />
                    </Group>
                ) : (
                    <MultiSelect
                        data={selectData}
                        value={selectedStudents}
                        onChange={setSelectedStudents}
                        label={t('select_students')}
                        placeholder={t('search_student_placeholder')}
                        searchable
                        clearable
                        nothingFoundMessage={t('no_students_found')}
                        maxDropdownHeight={300}
                        leftSection={selectedStudents.length > 0 ? null : undefined}
                        renderOption={({ option }) => {
                            const student = (Array.isArray(students) ? students : []).find(s => s.id.toString() === option.value);
                            return (
                                <Group gap="sm">
                                    <Avatar src={student?.avatar} size={24} radius="xl" />
                                    <Text size="sm">{option.label}</Text>
                                </Group>
                            );
                        }}
                    />
                )}

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onClose} disabled={addMutation.isPending}>
                        {common('actions.cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        loading={addMutation.isPending}
                        disabled={selectedStudents.length === 0}
                    >
                        {common('actions.add')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};
