<template>
  <div class="body">
    <h2>请为您最喜欢的歌手投票</h2>
    <div class="candidates">
      <div v-for="candidate in Array.from(candidates.values())" :key="candidate.id" class="candidate">
        <div class="can_info">
          <img :src="candidate.image" alt="候选人图像" />
          <div class="info">
            <p>{{ candidate.name }}<span>X</span>{{ candidate.votes }}</p>
            <button @click="voteForCandidate(candidate.id)">投票</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 最新投票更新 -->
    <div class="vote_updates">
      <h2>最新投票更新</h2>
      <ul>
        <li v-for="update in paginatedUpdates" :key="update.id + '-' + update.votes">
          {{ update.time }} - {{ update.name }} - {{ update.votes }}票
        </li>
      </ul>
      <div class="pagination">
        <button @click="goToPage(-1)" :disabled="page.value === 1">上一页</button>
        <button @click="goToPage(1)">下一页</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const candidates = reactive(new Map());
    const voteUpdates = ref([]);
    const itemsPerPage = 8; // 每页显示的项目数

    const route = useRoute();
    const router = useRouter();
    const page = ref(1);

    const loadCandidatesFromServer = async () => {
      try {
        const response = await axios.get('http://localhost:3000/candidates');
        response.data.forEach(candidate => {
          candidates.set(candidate.id, candidate);
        });
      } catch (error) {
        console.error('Error loading candidates from server:', error);
      }
    };

    const loadVotesFromServer = async () => {
      try {
        const response = await axios.get('http://localhost:3000/votes');
        voteUpdates.value = response.data.reverse(); // 确保最新的投票记录在前面
      } catch (error) {
        console.error('Error loading votes from server:', error);
      }
    };

    const voteForCandidate = async (id) => {
      const candidate = candidates.get(id);
      if (candidate) {
        candidate.votes += 1; // 增加本地候选人票数
        const updateData = {
          id: candidate.id,
          name: candidate.name,
          image: candidate.image,
          votes: candidate.votes
        };
        try {
          await axios.patch(`http://localhost:3000/candidates/${id}`, updateData);
        } catch (error) {
          console.error('Error updating candidate votes on server:', error);
          candidate.votes -= 1; // 回滚本地更改
          return; // 终止操作
        }
        // 更新投票数据
        const newUpdate = {
          time: new Date().toLocaleTimeString(),
          name: candidate.name,
          votes: candidate.votes,
          id: candidate.id
        };
        try {
          await axios.post('http://localhost:3000/votes', newUpdate);
          voteUpdates.value.unshift(newUpdate); // 本地添加新记录
        } catch (error) {
          console.error('Error sending vote to server:', error);
        }
      }
    };

    // 指定访问的vote信息
    const paginatedUpdates = computed(() => {
      const start = (page.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return voteUpdates.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(voteUpdates.value.length / itemsPerPage);
    });

    const goToPage = (newPage) => {
      console.log("Running1");
      console.log(totalPages.value);
      const nextPage = page.value + newPage;
      if (nextPage > 0 && nextPage <= totalPages.value) {
        page.value = nextPage;
        router.push({ query: { page: nextPage } });
        console.log("Running2");
      }
      console.log("Running3");
    };

    watch(() => route.query.page, (newPage) => {
  page.value = parseInt(newPage) || 1; // 更新 page 的值为新的路由参数值，如果参数无效，默认为 1
});


    onMounted(() => {
      loadCandidatesFromServer();
      loadVotesFromServer();
    });


    return {
      candidates,
      voteForCandidate,
      paginatedUpdates,
      page,
      totalPages,
      goToPage
    };
  }
};
</script>


  
<style scoped>
.body {
  font-family: Arial, sans-serif;
  align-items: center;
  justify-content: center; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border: 1px solid #ccc;
  border-radius: 10px;
}

h2 {
  margin-bottom: 20px;
}

.candidates {
  display: flex;
  gap: 20px; /* 调整候选人信息框之间的间距 */
}

.candidate {
  margin:10px;
  flex: 1 1 300px; /* 确保候选人信息框根据可用空间调整大小 */
}

.can_info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.can_info img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  /* 圆角头像 */
  border-radius: 50%;
}

.info {
  /* 水平文字居中 */
  text-align: center;
  margin-bottom: 5px;
}

button {
  padding: 5px 10px;
  border: none;
  background-color: #5cb85c;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #4ca04c;
}

.vote_updates {
  margin-top: 40px;
}

.vote_updates ul {
  list-style-type: none;
  padding: 0;
}

.vote_updates li {
  background: #f8f9fa;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}
</style>
  