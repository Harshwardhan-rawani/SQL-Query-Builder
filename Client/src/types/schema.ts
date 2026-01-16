export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
}

export type ColumnType = 
  | 'uuid'
  | 'serial'
  | 'integer'
  | 'bigint'
  | 'text'
  | 'varchar'
  | 'boolean'
  | 'timestamp'
  | 'date'
  | 'json'
  | 'jsonb'
  | 'decimal'
  | 'float';

export const COLUMN_TYPES: ColumnType[] = [
  'uuid',
  'serial',
  'integer',
  'bigint',
  'text',
  'varchar',
  'boolean',
  'timestamp',
  'date',
  'json',
  'jsonb',
  'decimal',
  'float'
];

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
}

export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export interface Relationship {
  id: string;
  fromTableId: string;
  fromColumnId: string;
  toTableId: string;
  toColumnId: string;
  relationType: RelationType;
}

export interface Schema {
  tables: Table[];
  relationships: Relationship[];
}

export interface SchemaState extends Schema {
  selectedTableId: string | null;
  selectedRelationshipId: string | null;
  history: Schema[];
  historyIndex: number;
}
