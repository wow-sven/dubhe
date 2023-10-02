module examples::multi_column_comp {
    use std::ascii::{String, string};
    use std::option::some;
    use std::vector;
    use sui::bcs;
    use sui::tx_context::TxContext;
    use sui::table::{Self, Table};
    use sui::table_vec::{Self, TableVec};
    use examples::entity_key;
    use examples::world::{Self, World};
  
    // Systems
	friend examples::example_system;

	const NAME: vector<u8> = b"multi_column";

	// state
	// last_update_time
	struct CompMetadata has store {
		id: address,
		name: String,
		types: vector<String>,
		entity_key_to_index: Table<address, u64>,
		entities: TableVec<address>,
		data: Table<address, vector<u8>>
	}

	public fun new(ctx: &mut TxContext): CompMetadata {
		let component = CompMetadata {
			id: id(),
			name: name(),
			types: types(),
			entity_key_to_index: table::new<address, u64>(ctx),
			entities: table_vec::empty<address>(ctx),
			data: table::new<address, vector<u8>>(ctx)
		};
		component
	}

	public fun id(): address {
		entity_key::from_bytes(NAME)
	}

	public fun name(): String {
		string(NAME)
	}

	public fun types(): vector<String> {
		vector[string(b"vector<u8>"), string(b"u64")]
	}

	public fun entities(world: &World): &TableVec<address> {
		let component = world::get_comp<CompMetadata>(world, id());
		&component.entities
	}

	public fun entity_length(world: &World): u64 {
		let component = world::get_comp<CompMetadata>(world, id());
		table_vec::length(&component.entities)
	}

	public fun data(world: &World): &Table<address, vector<u8>> {
		let component = world::get_comp<CompMetadata>(world, id());
		&component.data
	}

	public fun register(world: &mut World, ctx: &mut TxContext) {
		world::add_comp<CompMetadata>(world, NAME, new(ctx));
		world::emit_register_event(NAME, types());
	}

	public(friend) fun add(world: &mut World, key: address, state: vector<u8>, last_update_time: u64) {
		let component = world::get_mut_comp<CompMetadata>(world, id());
		let data = encode(state, last_update_time);
		table::add(&mut component.entity_key_to_index, key, table_vec::length(&component.entities));
		table_vec::push_back(&mut component.entities, key);
		table::add(&mut component.data, key, data);
		world::emit_add_event(id(), key, data)
	}

	public(friend) fun remove(world: &mut World, key: address) {
		let component = world::get_mut_comp<CompMetadata>(world, id());
		let index = table::remove(&mut component.entity_key_to_index, key);
		if(index == table_vec::length(&component.entities) - 1) {
			table_vec::pop_back(&mut component.entities);
		} else {
			let last_value = table_vec::pop_back(&mut component.entities);
			*table_vec::borrow_mut(&mut component.entities, index) = last_value;
		};
		table::remove(&mut component.data, key);
		world::emit_remove_event(id(), key)
	}

	public(friend) fun update(world: &mut World, key: address, state: vector<u8>, last_update_time: u64) {
		let component = world::get_mut_comp<CompMetadata>(world, id());
		let data = encode(state, last_update_time);
		*table::borrow_mut<address, vector<u8>>(&mut component.data, key) = data;
		world::emit_update_event(id(), some(key), data)
	}
	public(friend) fun update_state(world: &mut World, key: address, state: vector<u8>) {
		let component = world::get_mut_comp<CompMetadata>(world, id());
		let comp_data = table::borrow_mut<address, vector<u8>>(&mut component.data, key);
		let (_, last_update_time) = decode(*comp_data);
		let data = encode(state, last_update_time);
		*comp_data = data;
		world::emit_update_event(id(), some(key), data)
	}

	public(friend) fun update_last_update_time(world: &mut World, key: address, last_update_time: u64) {
		let component = world::get_mut_comp<CompMetadata>(world, id());
		let comp_data = table::borrow_mut<address, vector<u8>>(&mut component.data, key);
		let (state, _) = decode(*comp_data);
		let data = encode(state, last_update_time);
		*comp_data = data;
		world::emit_update_event(id(), some(key), data)
	}

	public fun get(world: &World, key: address): (vector<u8>,u64) {
		let component = world::get_comp<CompMetadata>(world, id());
		let data = table::borrow<address, vector<u8>>(&component.data, key);
		decode(*data)
	}

	public fun get_state(world: &World, key: address): vector<u8> {
		let component = world::get_comp<CompMetadata>(world, id());
		let data = table::borrow<address, vector<u8>>(&component.data, key);
		let (state, _) = decode(*data);
		state
	}

	public fun get_last_update_time(world: &World, key: address): u64 {
		let component = world::get_comp<CompMetadata>(world, id());
		let data = table::borrow<address, vector<u8>>(&component.data, key);
		let (_, last_update_time) = decode(*data);
		last_update_time
	}

	public fun contains(world: &World, key: address): bool {
		let component = world::get_comp<CompMetadata>(world, id());
		table::contains<address, vector<u8>>(&component.data, key)
	}

	public fun encode(state: vector<u8>, last_update_time: u64): vector<u8> {
		let data = vector::empty<u8>();
		vector::append(&mut data, bcs::to_bytes(&state));
		vector::append(&mut data, bcs::to_bytes(&last_update_time));
		data
	}

	public fun decode(bytes: vector<u8>): (vector<u8>,u64) {
		let data = bcs::new(bytes);
		(
			bcs::peel_vec_u8(&mut data),
			bcs::peel_u64(&mut data)
		)
	}
}
