type announcement={
    title: string;
    items: announcementItem[];
};
type announcementItem={
    link: string;
    title: string;
    date: Date;
    desc?: string;
};
type virtualClass={
    title: string;
    items: virtualClassItem[];
};
type virtualClassItem={
    link: string;
    title: string;
    date: Date;
    desc?: string;
};

export type{announcement,announcementItem,virtualClass,virtualClassItem,}