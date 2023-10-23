module examples::deploy_hook {
    use examples::world::{World, AdminCap, get_admin};
    use sui::object;

    /// Not the right admin for this world
    const ENotAdmin: u64 = 0;

    public entry fun run(world: &mut World, admin_cap: &AdminCap) {
        assert!( get_admin(world) == object::id(admin_cap), ENotAdmin);
    }

    #[test_only]
    public fun deploy_hook_for_testing(world: &mut World, admin_cap: &AdminCap){
        run(world, admin_cap)
    }
}
