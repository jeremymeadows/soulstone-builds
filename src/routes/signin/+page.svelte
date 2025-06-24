<script lang="ts">
    import { Build, score, sort_by, img_name } from "$lib";

    let build = new Build("test");
    build.character = "Barbarian";
    build.weapon = "Barbaric Cleavers";
    build.skills = [ "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage", "Skeletal Mage" ]
    build.runes = [ "Weapon Master", "More XP", "Get a skill", "Extra Help", "Skeletal Mage", "Skeletal Mage", "asd" ]
</script>

<h1>Sign In</h1>
<h2 class="center">Sign In or Create Account to create and share builds!</h2>


<div class="center">
    <input type="text" placeholder="email" />
    <br />
    <input type="password" placeholder="password" />
    <br />
    <button class="button is-primary">Sign In</button>
</div>

<style lang="scss">
</style>