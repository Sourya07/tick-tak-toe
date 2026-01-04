import mongoose from 'mongoose';
declare const connectDB: () => Promise<void>;
declare const User: mongoose.Model<{
    password: string;
    email: string;
    name?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    password: string;
    email: string;
    name?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    password: string;
    email: string;
    name?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    password: string;
    email: string;
    name?: string | null;
}, mongoose.Document<unknown, {}, {
    password: string;
    email: string;
    name?: string | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    password: string;
    email: string;
    name?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        password: string;
        email: string;
        name?: string | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        password: string;
        email: string;
        name?: string | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    password: string;
    email: string;
    name?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    password: string;
    email: string;
    name?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export { User, connectDB };
//# sourceMappingURL=db.d.ts.map