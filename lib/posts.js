import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from "remark";
import html from 'remark-html'

// 服务启动后的路径
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    // 读取某个文件夹下的文件名称
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map(fileName => {
        // 以文件名当成id
        const id = fileName.replace(/\.md$/, '');
        // 拼接全路径
        const fullPath = path.join(postsDirectory, fileName);
        // 读取文件内容
        const fileContents = fs.readFileSync(fullPath, 'utf-8');
        // 格式化内容
        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data
        };
    });

    return allPostsData.sort((a, b) => {
        if (a.data < b.data) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    });
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');

    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data
    };
}

