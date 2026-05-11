import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let users = await CRUDService.getAllUsers();
        return res.render("homepage.ejs", { users });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi máy chủ");
    }
};

let getAboutPage = async (req, res) => {
    return res.render("about.ejs");
};

let getCRUD = async (req, res) => {
    return res.render("crud.ejs", {
        error: req.query.error || null,
    });
};

let getFindAllCRUD = async (req, res) => {
    try {
        let data = await CRUDService.getAllUsers();
        return res.render("users/findAllUser.ejs", {
            datalist: data,
            message: req.query.message || null,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Lỗi khi tải danh sách");
    }
};

let postCRUD = async (req, res) => {
    try {
        await CRUDService.createNewUser(req.body);
        return res.redirect(
            "/get-crud?message=" +
                encodeURIComponent("Đã tạo người dùng thành công.")
        );
    } catch (error) {
        console.log(error);
        return res.redirect(
            "/crud?error=" +
                encodeURIComponent(
                    "Không thể tạo người dùng. Kiểm tra email trùng hoặc dữ liệu nhập."
                )
        );
    }
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        if (!userData) {
            return res.send("User not found");
        }
        return res.render("users/updateUser.ejs", {
            data: userData,
            error: req.query.error || null,
        });
    } else {
        return res.send("User not found");
    }
};

let putCRUD = async (req, res) => {
    try {
        await CRUDService.updateUserData(req.body);
        return res.redirect(
            "/get-crud?message=" +
                encodeURIComponent("Đã cập nhật thành công.")
        );
    } catch (e) {
        console.log(e);
        let id = req.body.id;
        return res.redirect(
            `/edit-crud?id=${id}&error=` +
                encodeURIComponent("Cập nhật thất bại.")
        );
    }
};

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        try {
            await CRUDService.deleteUserById(userId);
            return res.redirect(
                "/get-crud?message=" +
                    encodeURIComponent("Đã xóa người dùng.")
            );
        } catch (e) {
            console.log(e);
            return res.redirect(
                "/get-crud?message=" +
                    encodeURIComponent("Không thể xóa người dùng.")
            );
        }
    } else {
        return res.send("User not found");
    }
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    getFindAllCRUD: getFindAllCRUD,
    postCRUD: postCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};
