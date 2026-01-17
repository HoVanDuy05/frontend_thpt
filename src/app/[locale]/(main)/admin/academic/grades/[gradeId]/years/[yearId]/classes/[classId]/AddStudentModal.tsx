"use client";

import { useAddStudentsToClass, useGetAvailableStudents } from "@/api/AppQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Modal, Button, MultiSelect, Stack, Group, Text, Loader, Avatar, Skeleton, Badge, Box } from "@mantine/core";
import { IconUserPlus, IconSearch } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface AddStudentModalProps {
    opened: boolean;
    onClose: () => void;
    yearId: number;
    classId: number;
}

export const AddStudentModal = ({ opened, onClose, yearId, classId }: AddStudentModalProps) => {
    const t = useTranslations('admin.academic.classes');
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
                    <Stack gap="md">
                        <Skeleton height={40} radius="md" />
                        <Stack gap="xs">
                            {[1, 2, 3].map((i) => (
                                <Group key={i} gap="sm" p="xs">
                                    <Skeleton height={32} circle />
                                    <Skeleton height={20} width="70%" />
                                </Group>
                            ))}
                        </Stack>
                    </Stack>
                ) : (
                    <Box>
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
                            leftSection={<IconSearch size={16} />}
                            renderOption={({ option }) => {
                                const student = (Array.isArray(students) ? students : []).find(s => s.id.toString() === option.value);
                                return (
                                    <Group gap="sm" wrap="nowrap">
                                        <Avatar src={student?.avatar} size={32} radius="xl" />
                                        <Box style={{ flex: 1 }}>
                                            <Text size="sm" fw={500}>{student?.hoTen}</Text>
                                            <Text size="xs" c="dimmed">{student?.maSo || 'No ID'}</Text>
                                        </Box>
                                    </Group>
                                );
                            }}
                        />
                        {selectedStudents.length > 0 && (
                            <Group gap="xs" mt="xs">
                                <Badge size="sm" variant="light" color="blue">
                                    {selectedStudents.length} {selectedStudents.length === 1 ? 'student' : 'students'} selected
                                </Badge>
                            </Group>
                        )}
                    </Box>
                )}

                <Group justify="space-between" mt="xl">
                    <Text size="sm" c="dimmed">
                        {selectData.length} available students
                    </Text>
                    <Group gap="sm">
                        <Button variant="default" onClick={onClose} disabled={addMutation.isPending}>
                            {common('actions.cancel')}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            loading={addMutation.isPending}
                            disabled={selectedStudents.length === 0}
                            leftSection={<IconUserPlus size={16} />}
                        >
                            {common('actions.add')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
};
