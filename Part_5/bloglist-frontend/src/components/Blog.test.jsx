import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event'
import Blog from './Blog';
import CreateBlogForm from './CreateBlogForm';

describe('Blog and CreateBlog tests', () => {
    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 5,
        user: {
            name: 'Test User'
        }
    };

    test('only title and author at the beginning', async () => {
        const { container } = render(<Blog blog={blog} handleLike={() => { }} handleDelete={() => { }} />);
        const div = container.querySelector('.blog-details');
        expect(div).toBeNull();
        expect(screen.queryByText('http://testurl.com')).toBeNull();
        expect(screen.queryByText('likes: 5')).toBeNull();
    });

    test('all details after visible click', async () => {
        const { container } = render(<Blog blog={blog} handleLike={() => { }} handleDelete={() => { }} />);

        const user = userEvent.setup()
        const button = screen.getByText('view');
        await user.click(button)

        const div = container.querySelector('.blog-details');

        expect(div).toBeDefined();

        expect(screen.getByText('http://testurl.com')).toBeInTheDocument();
        expect(screen.getByText('likes: 5')).toBeInTheDocument();
    });

    test('check like button trigger', async () => {

        const mockHandler = vi.fn()

        render(<Blog blog={blog} handleLike={mockHandler} handleDelete={() => { }} />);

        const user = userEvent.setup()
        const viewButton = screen.getByText('view');
        await user.click(viewButton)

        const likeButton = screen.getByText('like');
        await user.click(likeButton)
        await user.click(likeButton)


        expect(mockHandler.mock.calls).toHaveLength(2)
    });


    test('create new blog creation data', async () => {
        const createBlog = vi.fn();

        render(<CreateBlogForm createBlog={createBlog} />);

        const inputs = screen.getAllByRole('textbox')
        const titleInput = inputs[0]
        const authorInput = inputs[1]
        const urlInput = inputs[2]
        const createButton = screen.getByText('Create');

        const user = userEvent.setup()
        await user.type(titleInput, 'New Blog Title');
        await user.type(authorInput, 'New Blog Author');
        await user.type(urlInput, 'http://newblogurl.com');
        await user.click(createButton);

        expect(createBlog.mock.calls).toHaveLength(1);
        expect(createBlog.mock.calls[0][0]).toEqual({
            title: 'New Blog Title',
            author: 'New Blog Author',
            url: 'http://newblogurl.com'
        });
    });

});
