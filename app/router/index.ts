import { createProject, getProject, projectList, updateProjectContent, updateProjectStatus } from "./project";
import { createTask, deleteTodo, membersList, todoList, updateTodoStatus, workspaceList } from "./workspace";
export const router = {
    workspace: {
        list: workspaceList,
        tasks: {
            list: todoList,
            create: createTask,
            update: updateTodoStatus,
            delete: deleteTodo
        },
        members: {
            list: membersList
        },
    },
    project: {
        create: createProject,
        list: projectList,
        get: getProject,
        update: updateProjectContent,
        update_Status: updateProjectStatus
    }
}