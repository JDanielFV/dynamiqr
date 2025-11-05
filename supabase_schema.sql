DROP TABLE IF EXISTS qrcodes;
DROP TABLE IF EXISTS folders;

CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE qrcodes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    destination_url TEXT NOT NULL,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    user_id TEXT NOT NULL
);
