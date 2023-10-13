package types

type CompData struct {
	PackageId   string      `json:"package_id"`
	SchemaName  string      `json:"comp_name"`
	EntityKey   string      `json:"entity_key"`
	IsEphemeral bool        `json:"is_ephemeral"`
	Data        interface{} `json:"data"`
	TimestampMs uint64      `json:"timestamp_ms"`
}
