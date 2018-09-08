$(document).ready(() => {
    $('.delete-article').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: () => {
                window,location.href='/';
            },
            error: (err) => {
                console.log(err);
            }
        })
    })
})

$(document).ready(() => {
    $('.delete-athlete').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/athletes/' + id,
            success: () => {
                window,
                location.href = '/';
            },
            error: (err) => {
                console.log(err);
            }
        })
    })
})