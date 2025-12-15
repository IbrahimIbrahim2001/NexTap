import { createProject, deleteProject, getProject, projectList, updateProjectContent, updateProjectStatus } from "./project";
import { createTask, deleteTodo, getMember, membersList, todoList, updateTodoStatus, workspaceList } from "./workspace";
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
            list: membersList,
            get: getMember,
        },
    },
    project: {
        create: createProject,
        list: projectList,
        get: getProject,
        update: updateProjectContent,
        update_Status: updateProjectStatus,
        delete: deleteProject,
    }
}