"use client";

import { useMemo } from 'react';
import { Anchor, type AnchorProps } from '@mantine/core';

export type BreadcrumbItem = {
    title: React.ReactNode;
    href: string;
};

type UseBreadcrumbsOptions = {
    LinkComponent: any;
    anchorProps?: Omit<AnchorProps, 'component' | 'href'>;
};

export const useBreadcrumbs = (items: BreadcrumbItem[], options: UseBreadcrumbsOptions) => {
    const { LinkComponent, anchorProps } = options;

    return useMemo(
        () =>
            items.map((item, index) => (
                <Anchor key={index} component={LinkComponent} href={item.href} {...anchorProps}>
                    {item.title}
                </Anchor>
            )),
        [items, LinkComponent, anchorProps]
    );
};
