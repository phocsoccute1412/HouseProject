import { useState, type SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'

import { api } from '@/utils/client/api'

import { useAutoAnimate } from '@formkit/auto-animate/react'


/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

export const TodoList = () => {
  var { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })
  const todoData = api.todoStatus.update.useMutation();
  const deleteAction=api.todo.delete.useMutation();

  const [filterSign, setFilterSign] = useState("all");
  
  const [parent, enableAnimations] = useAutoAnimate()

  const arrTodoAll:any[]= [];

  var arrCompleted:number[] = []

  todos.map((todo)=>{
    if(todo.status==="completed"){
      arrCompleted.push(todo.id);
    }
    arrTodoAll.push(todo);
  })

  const handleClickFilter = (event:any) => {
    const valueE = event.target.childNodes[0].textContent
    if(valueE=="Pending"){
      setFilterSign("pending");
    }
    else if(valueE=="Completed") {
      setFilterSign("completed")
    }
    else if(valueE=="All") {
      setFilterSign("all");
    }
  };
  if(filterSign=="all"||""){
    todos = todos.filter((todo)=>todo.status=="pending"||todo.status=="completed");
  }
  else if(filterSign=="pending" || "completed"){
    todos = todos.filter((todo)=>todo.status==filterSign);
  }
  return (<>
    <ul className="flex gap-2 text-center my-3" ref={parent}>
      <li className="border-gray-200 border px-6 py-3 rounded-full cursor-pointer" onClick={handleClickFilter}>All</li>
      <li className="border-gray-200 border px-6 py-3 rounded-full cursor-pointer" onClick={handleClickFilter}>Pending</li>
      <li className="border-gray-200 border px-6 py-3 rounded-full cursor-pointer" onClick={handleClickFilter}>Completed</li>
    </ul>
    <ul className="grid grid-cols-1 gap-y-3">
      {todos.map((todo) => (
        <li key={todo.id}>
          <div className={`${todo.status=="completed"?"bg-gray-100":""} flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm`}>
            <Checkbox.Root
              onClick={(event)=>{
                if(todo.status==="pending"){
                  todoData.mutate({status:"completed", todoId:todo.id})
                  arrCompleted.push(todo.id);
                  console.log(todo.status)
                }
                else {
                  todoData.mutate({status:"pending", todoId:todo.id})
                  arrCompleted.filter(element=>element!==todo.id)
                }
              }}
              checked={arrCompleted.includes(todo.id)}
              id={String(todo.id)}
              className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
            >
              <Checkbox.Indicator>
                <CheckIcon className="h-4 w-4 text-white" />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <label className={`block pl-3 font-medium ${todo.status=="completed"?"line-through text-gray-500":""}`} htmlFor={String(todo.id)}>
              {todo.body}
            </label>
            <XMarkIcon 
              className="w-6 h-6 ml-64 cursor-pointer"
              onClick={()=>{
                deleteAction.mutate({id:todo.id});
              }}
            ></XMarkIcon>
          </div>
        </li>
      ))}
    </ul>
    </>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        className='ml-6'
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
