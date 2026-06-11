import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase-client";
import logo from "./logo.png";

function Todo() {
  const navigate = useNavigate();

  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState(null);

  // AUTH CHECK
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      setUser(user);
    };

    loadUser();
  }, [navigate]);

  // FETCH TODOS (USER SPECIFIC)
  const fetchTodos = async (currentUser) => {
    const { data, error } = await supabase
      .from("TodoList1")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("id", { ascending: true });

    if (error) return console.warn(error.message);
    setTodoList(data || []);
  };

  useEffect(() => {
    if (user) fetchTodos(user);
  }, [user]);

  // ADD TODO
  const addTodo = async () => {
    if (!newTodo.trim() || !user) return;

    const { data, error } = await supabase
      .from("TodoList1")
      .insert([
        {
          name: newTodo.trim(),
          IsCompleted: false,
          user_id: user.id,
          email: user.email,
        },
      ])
      .select()
      .single();

    if (error) return console.warn(error.message);

    setTodoList((prev) => [...prev, data]);
    setNewTodo("");
  };

  // COMPLETE TASK
  const completeTask = async (todo) => {
    const { data, error } = await supabase
      .from("TodoList1")
      .update({ IsCompleted: !todo.IsCompleted })
      .eq("id", todo.id)
      .eq("user_id", user.id)
      .select();

    if (error || !data?.length) return;

    setTodoList((prev) =>
      prev.map((t) => (t.id === todo.id ? data[0] : t))
    );
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    const { error } = await supabase
      .from("TodoList1")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return console.warn(error.message);

    setTodoList((prev) => prev.filter((t) => t.id !== id));
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  const total = todoList.length;
  const done = todoList.filter((t) => t.IsCompleted).length;
  const pending = total - done;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden text-white">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* GLOW EFFECTS */}
      <div className="absolute w-96 h-96 bg-pink-500 blur-[160px] opacity-20 top-10 left-10 rounded-full"></div>
      <div className="absolute w-96 h-96 bg-purple-600 blur-[160px] opacity-20 bottom-10 right-10 rounded-full"></div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 rounded-lg z-20"
      >
        Logout
      </button>

      {/* HEADER */}
      <header className="w-full max-w-xl text-center mb-6 relative z-10">
        <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center shadow-xl shadow-pink-500/30">
          <img
            src={logo}
            alt="Rysonix Technologies logo"
            className="h-full w-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold">
          <span className="text-pink-400">Rysonix</span>{" "}
          <span className="text-purple-400">Technologies</span>
        </h1>

        <p className="text-sm text-gray-300">Build. Focus. Execute.</p>

        {/* USER */}
        {user && (
          <p className="text-xs text-gray-400 mt-2">
            Logged in as{" "}
            <span className="text-pink-400">{user.email}</span>
          </p>
        )}
      </header>

      {/* CARD */}
      <div className="w-full max-w-xl relative z-10 bg-black/60 backdrop-blur-xl border border-pink-500/20 rounded-2xl shadow-[0_0_60px_rgba(236,72,153,0.25)] p-6">

        <h2 className="text-xl font-semibold text-center">
          <span className="text-pink-400">What’s your focus</span>{" "}
          <span className="text-purple-400">today?</span>
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Small tasks → big impact
        </p>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-black/40 border border-pink-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-lg font-bold">{total}</p>
          </div>

          <div className="bg-black/40 border border-purple-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400">Done</p>
            <p className="text-lg font-bold text-pink-400">{done}</p>
          </div>

          <div className="bg-black/40 border border-fuchsia-500/20 rounded-xl p-3">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-lg font-bold text-purple-400">{pending}</p>
          </div>
        </div>

        {/* INPUT */}
        <div className="flex gap-3 mb-6">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-xl bg-black/50 border border-pink-500/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            onClick={addTodo}
            className="px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.03] transition"
          >
            Add
          </button>
        </div>

        {/* LIST */}
        <ul className="space-y-3">
          {todoList.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-black/50 border border-pink-500/10 rounded-xl px-4 py-3"
            >
              <span
                className={
                  todo.IsCompleted
                    ? "line-through text-gray-500"
                    : "text-white"
                }
              >
                {todo.name}
              </span>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => completeTask(todo)}
                  className="px-3 py-1 rounded-lg text-sm bg-purple-500 hover:bg-purple-600"
                >
                  {todo.IsCompleted ? "Undo" : "Done"}
                </button>

                <button
                  onClick={() => deleteTask(todo.id)}
                  className="px-3 py-1 rounded-lg text-sm bg-red-500 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* FOOTER (EXACT SAME STYLE AS YOUR OTHER CODE) */}
      <footer className="w-full max-w-xl text-center mt-6 text-xs text-gray-400 relative z-10 border-t border-pink-500/10 pt-4">
        &copy; 2026 Rysonix Technologies | All Rights Reserved
      </footer>
    </div>
  );
}

export default Todo;