module Api
    module V1
      class TasksController < ApplicationController
        before_action :set_workflow
        before_action :set_task, only: [:show, :update, :destroy]
  
        # GET /api/v1/workflows/:workflow_id/tasks
        def index
          tasks = @workflow.tasks.order(created_at: :desc)
          render json: tasks, status: :ok
        end
  
        # GET /api/v1/workflows/:workflow_id/tasks/:id
        def show
          render json: @task, status: :ok
        end
  
        # POST /api/v1/workflows/:workflow_id/tasks
        # body: { task: { title, description, status(optional) } }
        def create
          task = @workflow.tasks.new(task_params)
          task.status ||= "initial"
  
          if task.save
            render json: task, status: :created
          else
            render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        # PATCH/PUT /api/v1/workflows/:workflow_id/tasks/:id
        def update
          if @task.update(task_params)
            render json: @task, status: :ok
          else
            render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        # DELETE /api/v1/workflows/:workflow_id/tasks/:id
        def destroy
          @task.destroy
          head :no_content
        end
  
        private
  
        # Makes sure workflow belongs to current_user.company (multitenant)
        def set_workflow
          @workflow = current_user.company.workflows.find(params[:workflow_id])
        end
  
        def set_task
          @task = @workflow.tasks.find(params[:id])
        end
  
        def task_params
          params.require(:task).permit(:title, :description, :status)
        end
      end
    end
  end
  