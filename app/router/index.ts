import { createProject, getProject, projectList, updateProjectContent } from "./project";
import { createTask, membersList, todoList, workspaceList } from "./workspace";
export const router = {
    workspace: {
        list: workspaceList,
        tasks: {
            list: todoList,
            create: createTask
        },
        members: {
            list: membersList
        },
    },
    project: {
        create: createProject,
        list: projectList,
        get: getProject,
        update: updateProjectContent
    }
}