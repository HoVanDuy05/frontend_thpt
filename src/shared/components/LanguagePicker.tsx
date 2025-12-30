"use client";

import { UnstyledButton, Menu, Image, Group, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

const data = [
    { label: "VN", value: "vi", image: "https://flagicons.lipis.dev/flags/4x3/vn.svg" },
    { label: "EN", value: "en", image: "https://flagicons.lipis.dev/flags/4x3/us.svg" },
];

export function LanguagePicker() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const [opened, setOpened] = useState(false);
    const selected = data.find((item) => item.value === locale) || data[0];

    const handleLocaleChange = (value: string) => {
        router.replace(pathname, { locale: value });
    };

    const items = data.map((item) => (
        <Menu.Item
            leftSection={<Image src={item.image} w={14} h={10} alt={item.label} />}
            onClick={() => handleLocaleChange(item.value)}
            key={item.label}
            className="text-[10px] py-1 px-2 min-h-0"
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu
            id="language-picker"
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="xs"
            width={60}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton className="px-2 py-1 rounded-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <Group gap={4}>
                        <Image src={selected.image} w={14} h={10} alt={selected.label} radius={1} />
                        <Text className="text-[10px] font-bold leading-none">{selected.label}</Text>
                        <IconChevronDown
                            size={10}
                            stroke={3}
                            className={`transition-transform duration-300 ${opened ? "rotate-180" : ""}`}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown className="min-w-[60px] p-1">{items}</Menu.Dropdown>
        </Menu>
    );
}

