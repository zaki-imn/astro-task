import type Image from "./image";

export default interface Product {
    id: number;
    attributes: {
        title: string;
        price: string;
        image: { data: Image };
        uid: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}