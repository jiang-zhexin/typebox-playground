export interface PacketMetadata {
  scope: string;
  name: string;
  latest: string;
  versions: {
    [version: string]: {
      createdAt: string;
      yanked?: boolean;
    };
  };
}

export interface PacketVersionMetadata {
  manifest: {
    [file: string]: {
      size: number;
      checksum: string;
    };
  };
  moduleGraph2: {
    [file: string]: {
      dependencies?: dependency[];
    };
  };
  exports: {
    [k: string]: string;
  };
}

interface dependency {
  type: string;
  kind: string;
  specifier: string;
  specifierRange: number[][];
}
