export default interface Image {
    id: number;
    attributes: {
        name: string;
        url: string;
        createdAt: string;
        updatedAt: string;
    };
}