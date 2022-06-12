let move_speed = 3;
let gravity = 0.5;
let bird = document.querySelector('./images/bird');
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        bird.getElementsByClassName.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        play();
    }
});
function play() {
    function move() {

        if (game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (
                    bird_props.left < pipe_sprite_props.left +
                    pipe_sprite_props.width &&
                    bird_props.left +
                    bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top +
                    pipe_sprite_props.height &&
                    bird_props.top +
                    bird_props.height > pipe_sprite_props.top
                ) {
                    game_state = 'End';
                    message.innerHTML = 'Press Enter To Restart';
                    message.style.left = '28vw';
                    return;
                } else {
                    if (
                        pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right +
                        move_speed >= bird_props.left &&
                        element.increase_score == '1'
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;
        bird_dy = bird_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                bird_dy = -7.6;
            }
        });
        if (bird_props.top <= 0 ||
            bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.innerHTML = 'Press Enter To Restart';
            message.style.left = '28vw';
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;

    let pipe_gap = 35;
    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}